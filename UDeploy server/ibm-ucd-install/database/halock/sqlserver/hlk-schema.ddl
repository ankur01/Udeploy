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
    release_name nvarchar(36) not null,
    ver int default 0 not null
);

create table hlk_lock (
    id nvarchar(36) primary key,
    locked nvarchar(1) default 'N' not null,
    owner nvarchar(36),
    last_locked_heartbeat bigint default 0 not null
);
