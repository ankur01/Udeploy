-- Licensed Materials - Property of IBM Corp.
-- IBM UrbanCode Build
-- IBM UrbanCode Deploy
-- IBM UrbanCode Release
-- IBM AnthillPro
-- (c) Copyright IBM Corporation 2002, 2014. All Rights Reserved.
--
-- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
-- GSA ADP Schedule Contract with IBM Corp.
create index sec_internal_user_name_ix
    on sec_internal_user (name);

create unique index action_resource_role_mapping 
    on sec_role_action(sec_role_id, sec_action_id, sec_resource_role_id);

create index sec_action_name
        on sec_action(name);

create unique index sec_auth_token_uc
        on sec_auth_token(token);
        
create unique index sec_name_realm_mapping 
        on sec_group(name, sec_authorization_realm_id);
        
create unique index sec_group_role_team_mapping
        on sec_group_role_on_team(sec_group_id, sec_role_id, sec_team_space_id);
        
create unique index sec_resource_role_name
        on sec_resource_role(name);
        
create unique index sec_role_name
        on sec_role(name, ghosted_date);
        
create unique index sec_team_space_name
        on sec_team_space(name);

create unique index sec_user_uc
        on sec_user(name, sec_authentication_realm_id, ghosted_date);
        
create unique index sec_user_property_uc
        on sec_user_property(name, sec_user_id);
        
create unique index sec_user_role_on_team_mapping
        on sec_user_role_on_team(sec_user_id, sec_role_id, sec_team_space_id);
        
create unique index sec_user_group_mapping
        on sec_user_to_group(sec_user_id, sec_group_id);

create index sec_action_res_type
        on sec_action(sec_resource_type_id);

create index sec_auth_token_exp
        on sec_auth_token(expiration);

create index sec_auth_token_usr
        on sec_auth_token(sec_user_id);

create index sec_group_mapping_group_mapper
        on sec_group_mapping(sec_group_mapper_id);

create index sec_authz_rlm_prop_authz_rlm
        on sec_authorization_realm_prop(sec_authorization_realm_id);

create index sec_authn_rlm_prop_authn_rlm
        on sec_authentication_realm_prop(sec_authentication_realm_id);

create index sec_res_res_type
        on sec_resource(sec_resource_type_id);

create index sec_res_role_res_type
        on sec_resource_role(sec_resource_type_id);

create index sec_grot_role 
        on sec_group_role_on_team(sec_role_id);

create index sec_grot_team_space 
        on sec_group_role_on_team(sec_team_space_id);

create index sec_group_author_realm 
        on sec_group(sec_authorization_realm_id);

create index sec_role_action_sec_action 
        on sec_role_action(sec_action_id);

create index sec_role_action_res_role 
        on sec_role_action(sec_resource_role_id);

create index sec_rft_res_role 
        on sec_resource_for_team(sec_resource_role_id);

create index sec_rft_team_space 
        on sec_resource_for_team(sec_team_space_id);

create index sec_res_hier_child_sec_res 
        on sec_resource_hierarchy(child_sec_resource_id);

create index sec_user_prop_user_id 
        on sec_user_property(sec_user_id);

create index sec_urot_role_id 
        on sec_user_role_on_team(sec_role_id);

create index sec_utg_gid 
        on sec_user_to_group(sec_group_id);

create index sec_user_auth_realm 
        on sec_user(sec_authentication_realm_id);

create unique index action_resource_role_map
        on sec_role_action(sec_action_id, sec_resource_role_id, sec_role_id);

create unique index sec_user_role_on_team_map
        on sec_user_role_on_team(sec_team_space_id, sec_role_id, sec_user_id);

create unique index sec_user_group_map
        on sec_user_to_group(sec_group_id, sec_user_id);

-- the three indexes below use a different column order so we can have better
-- performance of queries that are concerned with different combinations of the columns.
-- With more performance data we might be able to decide which of these are the most necessary.
create unique index team_resource_team_map
        on sec_resource_for_team(sec_team_space_id, sec_resource_role_id, sec_resource_id);
create unique index team_resource_role_mapping
        on sec_resource_for_team(sec_resource_id, sec_team_space_id, sec_resource_role_id);
create unique index team_resource_role_map
        on sec_resource_for_team(sec_resource_role_id, sec_team_space_id, sec_resource_id);
