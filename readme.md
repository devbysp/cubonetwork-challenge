# Cubonetwork challange

[source](https://github.com/cubonetwork/fullstack-challenge/blob/master/layout-onepage.png)

## Architecture

### Datamodel

![datamodel](doc/datamodel/cubonetwork-challange-datamodel.svg)

The databse is created and maintained with [liquibase](https://www.liquibase.org/).

To start the database only on a docker environment

- enter the [database](./database) folder
- start the container with docker compose by executing `docker-compose up --build`

In the [compose.yaml](./database/compose.yaml) for convenience it is included a
[nginx reverse proxy](https://hub.docker.com/_/nginx) and an
[adminer](https://hub.docker.com/_/adminer/) docker container. The _adminer_ is a
database client. The database can be changed and inspected with this tool. The
_nginx_ makes sure that the admine is reachable from the
[http://localhost/dbadmin](http://localhost/dbadmin) url.

In the adminer you can log in with the following data

- Server: database
- Username: app
- Password: appPwd
- Database: cubonetwork
