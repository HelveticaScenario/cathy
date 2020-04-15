--
-- PostgreSQL database dump
--

-- Dumped from database version 11.6
-- Dumped by pg_dump version 12.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: app_hidden; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_hidden;


--
-- Name: app_private; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_private;


--
-- Name: app_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_public;


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

--
-- Name: drawings; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.drawings (
    mosaic_id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT drawings_height_check CHECK ((height > 0)),
    CONSTRAINT drawings_width_check CHECK ((width > 0))
);


--
-- Name: drawings drawings_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.drawings
    ADD CONSTRAINT drawings_pkey PRIMARY KEY (mosaic_id);


--
-- Name: SCHEMA app_hidden; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA app_hidden TO wfc_draw_visitor;


--
-- Name: SCHEMA app_public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA app_public TO wfc_draw_visitor;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO wfc_draw;
GRANT USAGE ON SCHEMA public TO wfc_draw_visitor;


--
-- Name: TABLE drawings; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.drawings TO wfc_draw_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA app_hidden REVOKE ALL ON SEQUENCES  FROM wfc_draw;
ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA app_hidden GRANT SELECT,USAGE ON SEQUENCES  TO wfc_draw_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA app_hidden REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA app_hidden REVOKE ALL ON FUNCTIONS  FROM wfc_draw;
ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA app_hidden GRANT ALL ON FUNCTIONS  TO wfc_draw_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA app_public REVOKE ALL ON SEQUENCES  FROM wfc_draw;
ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA app_public GRANT SELECT,USAGE ON SEQUENCES  TO wfc_draw_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA app_public REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA app_public REVOKE ALL ON FUNCTIONS  FROM wfc_draw;
ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA app_public GRANT ALL ON FUNCTIONS  TO wfc_draw_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA public REVOKE ALL ON SEQUENCES  FROM wfc_draw;
ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES  TO wfc_draw_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA public REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA public REVOKE ALL ON FUNCTIONS  FROM wfc_draw;
ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw IN SCHEMA public GRANT ALL ON FUNCTIONS  TO wfc_draw_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE wfc_draw REVOKE ALL ON FUNCTIONS  FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

