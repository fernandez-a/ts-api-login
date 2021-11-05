import { Db } from "mongodb";
import { getAndSaveRickyMortyCharacters } from "./populatedb";
import express, { NextFunction } from "express";
import { character, characters, delete_aco, login, register, signout } from "./resolvers";

const run = async () => {
  const db: Db = await getAndSaveRickyMortyCharacters();
  const app = express();
  app.set("db", db);

  app.use('/characters', async(req, res, next) => {
    console.log(req.headers.uiid)
    if(req.headers.uiid!= undefined){
      next();
    }
    else res.status(401).json({Status:401,Message:"Unauthorized"})
  });
  app.use('/character/:id', async(req, res, next) => {
    if(req.headers.uiid!= undefined){
      next();
    }
    else res.status(401).json({Status:401,Message:"Unauthorized"})
  });

  app.use('/delete', async(req, res, next) => {
    if(req.headers.uiid!= undefined){
      next();
    }
    else res.status(401).json({Status:401,Message:"Unauthorized"})
  });

  app.use('/signout', async(req, res, next) => {
    if(req.headers.uiid!= undefined){
      next();
    }
    else res.status(401).json({Status:401,Message:"Unauthorized"})
  });

  app.get("/status", async (req, res) => {
    res.status(200).send("Todo OK");
  });

  app.get("/login",login);
  app.post("/register",register)
  app.get("/characters", characters);
  app.get("/character/:id", character);
  app.get("/signOut",signout)
  app.delete("/delete",delete_aco)
  await app.listen(4000);
  //app.get("/character/:id", character);

  
};

try {
  run();
} catch (e) {
  console.error(e);
}
