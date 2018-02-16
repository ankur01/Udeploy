-- Licensed Materials - Property of IBM Corp.
-- IBM UrbanCode Build
-- IBM UrbanCode Deploy
-- IBM UrbanCode Release
-- IBM AnthillPro
-- (c) Copyright IBM Corporation 2002, 2014. All Rights Reserved.
--
-- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
-- GSA ADP Schedule Contract with IBM Corp.
create table inv_db_version (
    release_name varchar2(36) not null,
    ver numeric default 0 not null
);

create table inv_resource_inventory (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    resource_id varchar2(36) not null,
    version_id varchar2(36) not null,
    component_id varchar2(36) not null,
    status varchar2(255) not null,
    date_created numeric not null,
    deployment_request_id varchar2(36) not null,
    ghosted_date numeric default 0 not null
);

create table inv_desired_inventory (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    environment_id varchar2(36) not null,
    role_id varchar2(36),
    version_id varchar2(36) not null,
    component_id varchar2(36) not null,
    status varchar2(255) not null,
    date_created numeric not null,
    deployment_request_id varchar2(36),
    ghosted_date numeric default 0 not null
);

create table inv_env_prop_inventory (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    environment_id varchar2(36) not null,
    component_id varchar2(36) not null,
    prop_version numeric not null,
    date_created numeric not null,
    deployment_request_id varchar2(36) not null,
    ghosted_date numeric default 0 not null
);

create table inv_resource_config_inventory (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    resource_id varchar2(36) not null,
    prop_sheet_path varchar2(255) not null,
    prop_sheet_version numeric not null,
    date_created numeric not null,
    deployment_request_id varchar2(36) not null,
    ghosted_date numeric default 0 not null
);
