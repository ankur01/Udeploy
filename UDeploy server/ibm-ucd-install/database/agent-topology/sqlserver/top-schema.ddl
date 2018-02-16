-- Licensed Materials - Property of IBM Corp.
-- IBM UrbanCode Build
-- IBM UrbanCode Deploy
-- IBM UrbanCode Release
-- IBM AnthillPro
-- (c) Copyright IBM Corporation 2014. All Rights Reserved.
--
-- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
-- GSA ADP Schedule Contract with IBM Corp.
create table top_db_version (
    release_name nvarchar(36) not null,
    ver integer default 0 not null
);
create table top_server2server (
    id nvarchar(36) not null primary key,
    from_server_id nvarchar(64) not null,
    to_server_id nvarchar(64) not null
);

create table top_server2relay (
    id nvarchar(36) not null primary key,
    from_server_id nvarchar(64) not null,
    to_relay_id nvarchar(64) not null
);

create table top_server2agent (
    id nvarchar(36) not null primary key,
    from_server_id nvarchar(64) not null,
    to_agent_id nvarchar(64) not null
);

create table top_relay2agent (
    id nvarchar(36) not null primary key,
    from_server_id nvarchar(64),
    from_relay_id nvarchar(64) not null,
    to_agent_id nvarchar(64) not null
);

create table top_hatimer (
    id nvarchar(36) not null primary key,
    fired bigint not null
);
