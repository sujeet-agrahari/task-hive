You may have seen the use for methods like forRoot, register, and forFeature around some of the @nestjs/ packages and may be wondering what the difference for all of these methods are. There is no hard rule about this, but the @nestjs/ packages try to follow these guidelines:

When creating a module with:

register, you are expecting to configure a dynamic module with a specific configuration for use only by the calling module. For example, with Nest's @nestjs/axios: HttpModule.register({ baseUrl: 'someUrl' }). If, in another module you use HttpModule.register({ baseUrl: 'somewhere else' }), it will have the different configuration. You can do this for as many modules as you want.

forRoot, you are expecting to configure a dynamic module once and reuse that configuration in multiple places (though possibly unknowingly as it's abstracted away). This is why you have one GraphQLModule.forRoot(), one TypeOrmModule.forRoot(), etc.

forFeature, you are expecting to use the configuration of a dynamic module's forRoot but need to modify some configuration specific to the calling module's needs (i.e. which repository this module should have access to, or the context that a logger should use.)

All of these, usually, have their async counterparts as well, registerAsync, forRootAsync, and forFeatureAsync, that mean the same thing, but use Nest's Dependency Injection for the configuration as well.

The methods register, forRoot, and forFeature in NestJS serve to configure and provide modules in different scopes and contexts. These methods are most commonly seen in dynamic modules. Let’s break it down with clear examples to understand the distinctions.

1. register: Per-Module Scoped Configuration

   • Purpose: Configure a module independently for use in a specific module.
   • Behavior: Each call to register creates a new instance of the module with its own configuration, scoped only to the calling module.
   • Example: Using @nestjs/axios.

Example: Configuring HTTP clients for different APIs

// Module A
@Module({
imports: [
HttpModule.register({ baseURL: 'https://api.github.com' }),
],
providers: [GitHubService],
})
export class GitHubModule {}

// Module B
@Module({
imports: [
HttpModule.register({ baseURL: 'https://api.twitter.com' }),
],
providers: [TwitterService],
})
export class TwitterModule {}

    •	Result: GitHubModule and TwitterModule each use their own HttpModule with different configurations (baseURL).
    •	Use Case: When you need separate, isolated configurations for a module, and these configurations won’t affect or be reused in other modules.

2. forRoot: Global Scoped Configuration

   • Purpose: Configure a module once globally so that it can be reused across the application.
   • Behavior: Calling forRoot sets a global configuration for the module, which is shared across all modules that import it.
   • Example: Using @nestjs/graphql.

Example: Setting up GraphQL globally

@Module({
imports: [
GraphQLModule.forRoot({
autoSchemaFile: true,
}),
],
})
export class AppModule {}

    •	Result: The GraphQLModule configuration is shared across the entire app. All resolvers and services can rely on this centralized configuration.
    •	Use Case: Use forRoot when a module’s configuration applies globally and you want a single instance of that module.

3. forFeature: Feature-Specific Configuration

   • Purpose: Extend or narrow down the configuration from forRoot for specific use cases or modules.
   • Behavior: forFeature leverages the global configuration defined in forRoot but applies additional module-specific customizations.
   • Example: Using @nestjs/typeorm.

Example: Configuring repositories for specific modules

// UserModule
@Module({
imports: [
TypeOrmModule.forFeature([UserRepository]),
],
providers: [UserService],
})
export class UserModule {}

// OrderModule
@Module({
imports: [
TypeOrmModule.forFeature([OrderRepository]),
],
providers: [OrderService],
})
export class OrderModule {}

    •	Result: Both UserModule and OrderModule use the global database connection configured in TypeOrmModule.forRoot(), but access different repositories.
    •	Use Case: Use forFeature to narrow down the scope of a globally configured module (like defining specific entities or repositories for a module).

Async Variants

All of these methods (register, forRoot, forFeature) have Async counterparts, such as registerAsync, forRootAsync, and forFeatureAsync. These are used when the configuration requires asynchronous operations, such as fetching settings from a database or secrets manager.

Example: forRootAsync with @nestjs/config

@Module({
imports: [
TypeOrmModule.forRootAsync({
useFactory: (configService: ConfigService) => ({
type: 'postgres',
host: configService.get('DB_HOST'),
port: configService.get('DB_PORT'),
username: configService.get('DB_USERNAME'),
password: configService.get('DB_PASSWORD'),
database: configService.get('DB_NAME'),
autoLoadEntities: true,
synchronize: true,
}),
inject: [ConfigService],
}),
],
})
export class AppModule {}

    •	Use Case: When configuration values depend on asynchronous operations or external services.

Summary of Differences

Method Scope Purpose Example Usage
register Module-local Configure a module independently for each calling module. Multiple HttpModule configurations.
forRoot Application-global Configure a module once globally and reuse across the app. Global database or GraphQL config.
forFeature Module-specific Extend or narrow the global configuration (forRoot) for a specific module’s requirements. Feature-specific repositories.
registerAsync Module-local Same as register, but configuration values are resolved asynchronously. Dynamic HTTP module configuration.
forRootAsync Application-global Same as forRoot, but configuration values are resolved asynchronously. Dynamic database config.
forFeatureAsync Module-specific Same as forFeature, but configuration values are resolved asynchronously. Dynamic repository selection.

By following these conventions, NestJS ensures modularity, scalability, and flexibility in application design. Let me know if you’d like a deeper dive into any part!

## Guards

Auth or Authorization: Guards have a single responsibility. They determine whether a given request will be handled by the route handler or not, depending on certain conditions (like permissions, roles, ACLs, etc.) present at run-time.

But middleware, by its nature, is dumb. It doesn't know which handler will be executed after calling the next() function. On the other hand, Guards have access to the ExecutionContext instance, and thus know exactly what's going to be executed next.

> Guards are executed after all middleware, but before any interceptor or pipe.

We can attach a guard at controller, method or global

```
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}
```

```
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

## Interceptors

An interceptor is a class annotated with the @Injectable() decorator and implements the NestInterceptor interface.
Interceptors have a set of useful capabilities which are inspired by the [Aspect Oriented Programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming) (AOP) technique. They make it possible to:

- bind extra logic before / after method execution
- transform the result returned from a function
- transform the exception thrown from a function
- extend the basic function behavior
- completely override a function depending on specific conditions (e.g., for caching purposes)
