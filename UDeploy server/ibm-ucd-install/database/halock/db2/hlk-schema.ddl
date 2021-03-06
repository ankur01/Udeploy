-- Licensed Materials - Property of IBM Corp.
-- IBM UrbanCode Build
-- IBM UrbanCode Deploy
-- IBM UrbanCode Release
-- IBM AnthillPro
-- (c) Copyright IBM Corporation 2015. All Rights Reserved.
--
-- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
-- GSA ADP Schedule Contract with IBM Corp.
create table hlk_db_version (
    release_name varchar(36) not null,
    ver integer default 0 not null
);

create table hlk_lock (
    id varchar(36) not null primary key,
    locked varchar(1) default 'N' not null,
    owner varchar(36),
    last_locked_heartbeat bigint default 0 not null
);
