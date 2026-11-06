create function public.wroomer_enforce_photo_limit()
returns trigger
language plpgsql
set search_path = ''
as $function$
declare
  new_images jsonb := coalesce(new.images, '[]'::jsonb);
  new_legacy jsonb := coalesce(new.zdjecia, '[]'::jsonb);
  old_images jsonb := '[]'::jsonb;
  old_legacy jsonb := '[]'::jsonb;
  new_gallery jsonb;
  old_gallery jsonb := '[]'::jsonb;
  candidate record;
  new_count integer;
  old_count integer;
begin
  if tg_op = 'UPDATE' then
    if (new.images, new.zdjecia, new.image_url, new.image) is not distinct from
       (old.images, old.zdjecia, old.image_url, old.image) then
      return new;
    end if;
    old_images := coalesce(old.images, '[]'::jsonb);
    old_legacy := coalesce(old.zdjecia, '[]'::jsonb);
    old_gallery := (case when jsonb_array_length(old_images) > 0 then old_images else old_legacy end)
      || coalesce(to_jsonb(nullif(old.image_url, '')), '[]'::jsonb)
      || coalesce(to_jsonb(nullif(old.image, '')), '[]'::jsonb);
  end if;

  if jsonb_typeof(new_images) <> 'array' or jsonb_typeof(new_legacy) <> 'array' then
    raise exception using errcode = '23514', message = 'Galeria zdjęć musi być listą.';
  end if;
  new_gallery := (case when jsonb_array_length(new_images) > 0 then new_images else new_legacy end)
    || coalesce(to_jsonb(nullif(new.image_url, '')), '[]'::jsonb)
      || coalesce(to_jsonb(nullif(new.image, '')), '[]'::jsonb);

  for candidate in
    select new_images as photos, old_images as previous, false as deduplicate
    union all select new_legacy, old_legacy, false
    union all select new_gallery, old_gallery, true
  loop
    if candidate.deduplicate then
      select count(distinct coalesce(
        case when jsonb_typeof(item) = 'object' then coalesce(item->>'url', item->>'src', item->>'image_url') else item #>> '{}' end,
        item::text))
      into new_count from jsonb_array_elements(candidate.photos) as item;
      select count(distinct coalesce(
        case when jsonb_typeof(item) = 'object' then coalesce(item->>'url', item->>'src', item->>'image_url') else item #>> '{}' end,
        item::text))
      into old_count from jsonb_array_elements(candidate.previous) as item;
    else
      new_count := jsonb_array_length(candidate.photos);
      old_count := jsonb_array_length(candidate.previous);
    end if;
    if new_count > 30 and (new_count > old_count or not candidate.previous @> candidate.photos) then
      raise exception using errcode = '23514', message = 'Limit ogłoszenia to 30 zdjęć. Usuń nadmiarowe zdjęcia przed dodaniem nowych.';
    end if;
  end loop;
  return new;
end;
$function$;

revoke execute on function public.wroomer_enforce_photo_limit() from public, anon, authenticated;

create trigger wroomer_enforce_photo_limit
before insert or update of images, zdjecia, image_url, image on public.ogloszenia
for each row execute function public.wroomer_enforce_photo_limit();
