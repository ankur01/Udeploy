-- Licensed Materials - Property of IBM Corp.
-- IBM UrbanCode Build
-- IBM UrbanCode Deploy
-- IBM UrbanCode Release
-- IBM AnthillPro
-- (c) Copyright IBM Corporation 2014. All Rights Reserved.
--
-- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
-- GSA ADP Schedule Contract with IBM Corp.

create index top_server2server_from on top_server2server(from_server_id);
create index top_server2server_to on top_server2server(to_server_id);
create index top_server2relay_from on top_server2relay(from_server_id);
create index top_server2relay_to on top_server2relay(to_relay_id);
create index top_server2agent_from on top_server2agent(from_server_id);
create index top_server2agent_to on top_server2agent(to_agent_id);
create index top_relay2agent_from on top_relay2agent(from_relay_id);
create index top_relay2agent_to on top_relay2agent(to_agent_id);
