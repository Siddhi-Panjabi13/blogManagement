import { Request } from "express";
import { IUSER } from "./user.interface";
export interface REQUEST1 extends Request{
user:IUSER|null;
}