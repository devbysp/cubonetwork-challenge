FROM liquibase/liquibase:4.25-alpine

ARG MYSQL_CONNECTOR_VERSION

# Download and install mysql-connector-java-{version}.jar
RUN wget -O /liquibase/lib/mysql-connector-java-${MYSQL_CONNECTOR_VERSION}.jar \
    https://repo1.maven.org/maven2/mysql/mysql-connector-java/${MYSQL_CONNECTOR_VERSION}/mysql-connector-java-${MYSQL_CONNECTOR_VERSION}.jar

# Download and install wait-for-it script
USER root
RUN wget -O /usr/local/bin/wait-for-it.sh \
    https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod 550 /usr/local/bin/wait-for-it.sh
