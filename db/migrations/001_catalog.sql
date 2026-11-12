CREATE TABLE radar_states (
  code text PRIMARY KEY CHECK (code ~ '^[A-Z]{2}$'),
  name text NOT NULL
);
CREATE TABLE radar_organizations (
  id text PRIMARY KEY,
  name text NOT NULL UNIQUE
);
CREATE TABLE radar_notices (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9][a-z0-9-]{0,99}$'),
  organization_id text NOT NULL REFERENCES radar_organizations(id),
  title text NOT NULL CHECK (length(trim(title)) > 0),
  source_label text NOT NULL,
  source_url text NOT NULL CHECK (source_url ~ '^https://'),
  requirements_source_label text,
  requirements_source_url text CHECK (requirements_source_url ~ '^https://'),
  review_status text NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending','approved','rejected')),
  reviewed_on date,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (review_status <> 'approved' OR reviewed_on IS NOT NULL),
  CHECK ((requirements_source_label IS NULL) = (requirements_source_url IS NULL))
);
CREATE TABLE radar_opportunities (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9][a-z0-9-]{0,99}$'),
  notice_id text NOT NULL REFERENCES radar_notices(id),
  role text NOT NULL CHECK (length(trim(role)) > 0),
  kind text NOT NULL CHECK (kind IN ('Concurso público','Seleção simplificada')),
  professional_area text NOT NULL,
  specialty text NOT NULL,
  salary numeric(12,2) CHECK (salary >= 0),
  salary_label text NOT NULL,
  board text NOT NULL,
  requirement text NOT NULL,
  eligibility text NOT NULL,
  start_date date,
  start_time time,
  end_date date,
  end_time time,
  stage text NOT NULL CHECK (stage IN ('ongoing','closed','finished')),
  exam_location text,
  note text,
  review_status text NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending','approved','rejected')),
  reviewed_on date,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (review_status <> 'approved' OR reviewed_on IS NOT NULL),
  CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date)
);
CREATE TABLE radar_opportunity_locations (
  opportunity_id text NOT NULL REFERENCES radar_opportunities(id) ON DELETE CASCADE,
  position integer NOT NULL CHECK (position >= 0),
  state text NOT NULL REFERENCES radar_states(code),
  municipality_id integer CHECK (municipality_id > 0),
  municipality_name text,
  tentative boolean NOT NULL DEFAULT false,
  reserve_only boolean NOT NULL DEFAULT false,
  PRIMARY KEY (opportunity_id, position),
  CHECK ((municipality_id IS NULL) = (municipality_name IS NULL))
);
CREATE TABLE radar_amendments (
  notice_id text NOT NULL REFERENCES radar_notices(id) ON DELETE CASCADE,
  id text NOT NULL,
  published_on date NOT NULL,
  title text NOT NULL,
  source_label text NOT NULL,
  source_url text NOT NULL CHECK (source_url ~ '^https://'),
  changes jsonb NOT NULL CHECK (jsonb_typeof(changes) = 'array'),
  review_status text NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending','approved','rejected')),
  PRIMARY KEY (notice_id,id)
);
CREATE INDEX radar_opportunities_notice ON radar_opportunities(notice_id);
CREATE INDEX radar_opportunities_filters ON radar_opportunities(review_status,professional_area,specialty);
CREATE INDEX radar_locations_region ON radar_opportunity_locations(state,municipality_id,opportunity_id);

CREATE FUNCTION radar_normalize(text) RETURNS text
LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
  SELECT translate(lower(coalesce($1,'')), 'áàâãäéèêëíìîïóòôõöúùûüç', 'aaaaaeeeeiiiiooooouuuuc');
$$;
CREATE FUNCTION radar_status(date,time,date,time,text,timestamp) RETURNS text
LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
  SELECT CASE
    WHEN $3 IS NULL THEN 'unknown'
    WHEN $1 IS NOT NULL AND $6 < $1 + coalesce($2,'00:00'::time) THEN 'upcoming'
    WHEN $6 < $3 + coalesce($4,'23:59'::time)
      OR ($4 IS NULL AND $6 = $3 + '23:59'::time)
      THEN CASE WHEN $1 IS NULL THEN 'unknown' ELSE 'open' END
    ELSE $5 END;
$$;

CREATE VIEW radar_catalog AS
SELECT o.*, org.name AS org,
  radar_normalize(concat_ws(' ', org.name,o.role,o.professional_area,o.specialty,o.board,o.requirement,loc.search_text)) AS search_text,
  jsonb_build_object(
    'id',o.id,'noticeId',o.notice_id,'org',org.name,'role',o.role,'kind',o.kind,
    'professionalArea',o.professional_area,'specialty',o.specialty,
    'salary',o.salary,'salaryLabel',o.salary_label,'board',o.board,
    'requirement',o.requirement,'eligibility',o.eligibility,'stage',o.stage,
    'locations',coalesce(loc.items,'[]'::jsonb),
    'notice',jsonb_build_object('org',org.name,'title',n.title,
      'source',jsonb_build_object('label',n.source_label,'url',n.source_url))
      || CASE WHEN am.items IS NOT NULL THEN jsonb_build_object('amendments',am.items) ELSE '{}'::jsonb END
      || CASE WHEN n.requirements_source_url IS NOT NULL THEN
        jsonb_build_object('requirementsSource',jsonb_build_object('label',n.requirements_source_label,'url',n.requirements_source_url))
      ELSE '{}'::jsonb END
  ) || jsonb_strip_nulls(jsonb_build_object(
    'start',to_char(o.start_date,'YYYY-MM-DD'),'startHour',left(o.start_time::text,5),
    'end',to_char(o.end_date,'YYYY-MM-DD'),'endHour',left(o.end_time::text,5),
    'examLocation',o.exam_location,'note',o.note
  )) AS payload
FROM radar_opportunities o
JOIN radar_notices n ON n.id=o.notice_id
JOIN radar_organizations org ON org.id=n.organization_id
LEFT JOIN LATERAL (
  SELECT jsonb_agg(
    jsonb_build_object('state',l.state)
    || CASE WHEN l.municipality_id IS NOT NULL THEN jsonb_build_object('municipality',jsonb_build_object('id',l.municipality_id,'name',l.municipality_name)) ELSE '{}'::jsonb END
    || CASE WHEN l.tentative THEN '{"tentative":true}'::jsonb ELSE '{}'::jsonb END
    || CASE WHEN l.reserve_only THEN '{"reserveOnly":true}'::jsonb ELSE '{}'::jsonb END
    ORDER BY l.position
  ) AS items,
  string_agg(concat_ws(' ',l.municipality_name,l.state,s.name),' ') AS search_text
  FROM radar_opportunity_locations l JOIN radar_states s ON s.code=l.state WHERE l.opportunity_id=o.id
) loc ON true
LEFT JOIN LATERAL (
  SELECT jsonb_object_agg(a.id,jsonb_build_object(
    'date',to_char(a.published_on,'YYYY-MM-DD'),'title',a.title,
    'source',jsonb_build_object('label',a.source_label,'url',a.source_url),'changes',a.changes)) AS items
  FROM radar_amendments a WHERE a.notice_id=n.id AND a.review_status='approved'
) am ON true
WHERE o.review_status='approved' AND n.review_status='approved';
