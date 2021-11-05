import { CONNREFUSED } from "dns";
import { NextFunction, Request, Response } from "express";
import { Db } from "mongodb";
import { json } from "stream/consumers";
import { v4 as uuidv4 } from 'uuid';

export const characters = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const db: Db = req.app.get("db");
  const chars = await db
    .collection("Characters")
    .find()
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .toArray();
    res.status(200).json(chars);
  res.status(400).json({Error:"Not logged in"});
};

export const character = async (req: Request, res: Response) => {
  const id = req.params.id;
  const db: Db = req.app.get("db");
  const char = await db.collection("Characters").findOne({ id: parseInt(id) });
  if (char) res.status(200).json(char);
  else res.status(404).send();
};

export const register = async (req: Request, res: Response) => {
  const username = req.query.username;
  const password = req.query.password;
  const db: Db = req.app.get("db");
  const user = await db.collection("R_users").findOne({username:username});
  if(!user){
    db.collection("R_users").insertOne({
      username: username,
      password: password
    });
    res.status(200).json({
      Status:res.statusCode,
      Message: "Usuario creado",
      Usuario: username
    });
  }
  else{
    res.status(409).json({Error:"User already created"})
  }

  
  
}; 

export const login = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const username = req.query.username;
  const password = req.query.password;
  const uiid_new = uuidv4()
  try {
    const user = await db.collection("R_users").findOneAndUpdate({username:username,password:password},{'$set':{uiid:uiid_new}});
    if(!user){
      res.status(404).json({
        Status: 404,
        Error:"User not found"
      });
    }
    else{
      res.status(200).json({
        Status: 200,
        Username:req.query.username,
        Uiid:uiid_new,

      });
    }
    res.json(400).json({
      Error:"Not logged in"
    });
  } catch (e) {
    throw(e);
  }
};


export const signout = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const username = req.query.username;
  const password = req.query.password;
  try {
    const user = await db.collection("R_users").findOneAndUpdate({username:username,password:password},{'$set':{uiid:null}});
  } catch (e) {
    throw(e);
  }
  res.status(200).json({
    Status:res.statusCode,
    Message: "Sign out",
    Usuario: username
  });
};


export const delete_aco = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const username = req.query.username;
  const password = req.query.password;
  try {
    const user = await db.collection("R_users").findOneAndDelete({username:username,password:password,uiid:req.headers.uiid});
  } catch (e) {
    throw(e);
  }
  res.status(200).json({
    Status:res.statusCode,
    Message: "Account deleted",
    Usuario: username
  });
};