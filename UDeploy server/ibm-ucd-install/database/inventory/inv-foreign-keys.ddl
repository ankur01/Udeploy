-- Licensed Materials - Property of IBM Corp.
-- IBM UrbanCode Build
-- IBM UrbanCode Deploy
-- IBM UrbanCode Release
-- IBM AnthillPro
-- (c) Copyright IBM Corporation 2002, 2014. All Rights Reserved.
--
-- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
-- GSA ADP Schedule Contract with IBM Corp.
-- inv_resource_inventory
create index inv_res_inv_resource_id on inv_resource_inventory(resource_id);
create index inv_res_inv_version_id on inv_resource_inventory(version_id);
create index inv_res_inv_component_id on inv_resource_inventory(component_id);
create index inv_res_inv_request_id on inv_resource_inventory(deployment_request_id);

-- inv_desired_inventory
create index inv_des_inv_environment_id on inv_desired_inventory(environment_id, ghosted_date, date_created desc);
create index inv_des_inv_version_id on inv_desired_inventory(version_id);
create index inv_des_inv_component_id on inv_desired_inventory(component_id);
create index inv_des_inv_request_id on inv_desired_inventory(deployment_request_id);

-- inv_env_prop_inventory
create index inv_env_prop_environment_id on inv_env_prop_inventory(environment_id);
create index inv_env_prop_component_id on inv_env_prop_inventory(component_id);
create index inv_env_prop_request_id on inv_env_prop_inventory(deployment_request_id);

-- inv_resource_config_inventory
create index inv_res_conf_resource_id on inv_resource_config_inventory(resource_id);
create index inv_res_conf_prop_sheet_path on inv_resource_config_inventory(prop_sheet_path);
create index inv_res_conf_request_id on inv_resource_config_inventory(deployment_request_id);
create index inv_res_conf_resprop on inv_resource_config_inventory(ghosted_date, resource_id, prop_sheet_path);
