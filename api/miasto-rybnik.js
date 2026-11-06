import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const template = readFileSync(join(process.cwd(), 'miasta/rybnik.html'), 'utf8');
const endpoint = 'https://bdpydgsfowtuvjnkyeeg.supabase.co/rest/v1/ogloszenia';
const key = 'sb_publishable_S1qH_mBZaX7-bzmfJ0IVGA_6hxGbJWd';
const cities = ['Rybnik', 'Rydułtowy', 'Żory', 'Wodzisław Śląski', 'Czerwionka-Leszczyny', 'Gaszowice'];
const columns = 'id,slug,title,brand,marka,model,year,rocznik,price,cena,miasto,location,lokalizacja,image_url,image,images,zdjecia';
const currency = new Intl.NumberFormat('pl-PL');
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
const normalize = value => String(value ?? '').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').trim();

export function listingCity(car) {
  const location = normalize(car.miasto || car.location || car.lokalizacja);
  return cities.find(city => {
    const name = normalize(city);
    return location === name || location.startsWith(name + ',') ||
      location.startsWith(name + ' (') || new RegExp('\\b\\d{2}-\\d{3}\\s+' + name + '[.]?$').test(location);
  });
}

function photoUrl(car) {
  const first = car.images?.[0] || car.zdjecia?.[0];
  const value = car.image_url || car.image || (typeof first === 'string' ? first : first?.url || first?.src || first?.image_url);
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

function card(car, eager) {
  const image = photoUrl(car);
  const title = car.title || [car.brand || car.marka, car.model].filter(Boolean).join(' ') || 'Zobacz samochód';
  const price = Number(car.price ?? car.cena);
  const year = car.year || car.rocznik;
  const photo = image ? '<img src="' + escapeHtml(image) + '" alt="" loading="' +
    (eager ? 'eager' : 'lazy') + '" decoding="async">' : '<span class="listing-photo-empty">Brak zdjęcia</span>';
  return '<li class="listing-card"><a href="/auto/' + encodeURIComponent(car.slug || car.id) + '">' +
    photo + '<span class="listing-details"><span class="listing-title">' + escapeHtml(title) +
    '</span><span class="listing-price">' + (price > 0 ? currency.format(price) + ' zł' : 'Cena do uzgodnienia') +
    '</span><span class="listing-place">' + escapeHtml(car.city) + (year ? ' · ' + escapeHtml(year) : '') + '</span></span></a></li>';
}

function section(heading, rows, empty, eager = false) {
  return '<section class="listings-section"><h2>' + heading + '</h2>' +
    (rows.length ? '<ul class="listing-grid">' + rows.map((car, i) => card(car, eager && i === 0)).join('') +
      '</ul>' : '<p>' + empty + '</p>') + '</section>';
}

async function readListings() {
  const listings = [];
  const params = new URLSearchParams({select: columns, status: 'eq.active', is_banned: 'eq.false',
    order: 'created_at.desc,id.asc', limit: '500'});
  for (let offset = 0; offset < 10000; offset += 500) {
    params.set('offset', String(offset));
    const response = await fetch(endpoint + '?' + params, {headers: {apikey: key}, signal: AbortSignal.timeout(6500)});
    if (!response.ok) throw new Error('Listings HTTP ' + response.status);
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error('Invalid listing response');
    listings.push(...rows);
    if (rows.length < 500) return listings;
  }
  throw new Error('Listings pagination limit');
}

export function renderListings(listings) {
  const cars = listings.flatMap(car => {
    const city = listingCity(car);
    return city && /^[a-zA-Z0-9_-]{1,150}$/.test(car.slug || car.id || '') ? [{...car, city}] : [];
  });
  const local = cars.filter(car => car.city === 'Rybnik').slice(0, 12);
  const nearby = cities.slice(1).map(city => cars.filter(car => car.city === city));
  const surrounding = Array.from({length: 12}, (_, i) => nearby.map(group => group[i]).filter(Boolean)).flat().slice(0, 12);
  return section('Aktualne ogłoszenia z Rybnika', local, 'Obecnie nie ma aktywnych ofert z samego Rybnika. Zobacz samochody z sąsiednich miejscowości.', true) +
    section('Auta na sprzedaż w okolicach Rybnika', surrounding, 'Obecnie nie ma aktywnych ofert w wybranych okolicznych miejscowościach.');
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(405).end();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  try {
    const cards = renderListings(await readListings());
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
    return res.status(200).send(template.replace(/<!-- LOCAL_LISTINGS_START -->[\s\S]*?<!-- LOCAL_LISTINGS_END -->/, () => cards));
  } catch (error) {
    console.error('Rybnik listings:', error);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(template);
  }
}
