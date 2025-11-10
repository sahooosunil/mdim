export default class RoleNotFoundError extends Error {
   constructor(msg){
    super(msg);
    this.message = msg;
   }
}