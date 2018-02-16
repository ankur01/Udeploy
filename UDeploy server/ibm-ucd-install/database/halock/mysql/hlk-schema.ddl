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
    ver numeric default 0 not null
) engine = innodb;

create table hlk_lock (
    id varchar(36) primary key,
    locked varchar(1) default 'N' not null,
    owner varchar(36),
    last_locked_heartbeat bigint default 0 not null
) engine = innodb;
