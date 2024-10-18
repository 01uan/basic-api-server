export interface RouteDefinition {
    param: string; // placeholder for any params in the URL example /users/1 denoted :id
    method: string; // HTTP request method examples: GET, POST, PUT, DELETE
    action:string; // the method name in the controller examples all, save, remove in the UserController
}