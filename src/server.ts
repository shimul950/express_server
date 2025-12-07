import express, { NextFunction } from "express";
import { Request, Response } from "express";

import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRouter } from "./modules/user/user.routes";
import { todoRouter } from "./modules/todo/todo.routes";
import { authRouter } from "./modules/auth/auth.routes";


const app = express();
const port = config.port;

//parser
app.use(express.json());
// app.use(express.json());

//auth routes
app.use("/auth", authRouter)


//initializing Database
initDB();


app.get("/",logger, (req: Request, res: Response) => {
  res.send('Hello World!');
})

//! users CRUD (create, read, update, delete)

app.use("/users",userRouter)



//! todos
//>>>>>>>>>>>>>>>>>create todos
app.use("/todos",todoRouter)

//>>>>>>>>>>>>>>>>>get all todos 
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM todos 
      `);
    res.status(200).json({
      success: true,
      message: "todos retrieved successfully",
      data: result.rows
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err
    })
  }
});

//>>>>>>>>>>>>>>>>>get single todo 
app.get("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM todos WHERE id =$1`, [req.params.id])
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'todo not found'
      })
    } else {
      res.status(200).json({
        success:true,
        message: "Todo fetched successfully",
        data: result.rows[0]
      })
    }
  }
  catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }

})


//>>>>>>>>>>>>>>>>update single todo
app.put("/todos/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id);
  const {title, completed} = req.body;
  try {
    const result = await pool.query(`UPDATE todos SET title=$1,completed=$2 WHERE id=$3 RETURNING *`,[title,completed,req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'user not found'
      })
    } else {
      res.status(200).json({
        success:true,
        message: "Todo updated successfully",
        data: result.rows[0]
      })
    }
  }
  catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }

})

//!>>>>>>>>>>>>>>>auto catch error (route not found)
app.use((req,res)=>{
  res.status(404).json({
    success: false,
    message:"Route not found",
    path: req.path
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
