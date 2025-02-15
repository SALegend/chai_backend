const asyncHandler=(requestHandler)=>{
(req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
}
}
export {asyncHandler}


// another way of writing usin try catch block

// const asyncHandler=()=>{async()=>{}}
// just a function inside function
// const asyncHandler=(fn)=>async(req,res,next)=>{
//     try{
//         await fn(req,res,next)
//     }
//     catch(error)
//     {
//         res.status(err.code||500).json(
//             {
//                 success:false,
//                 message:err.message
//             }
//         )
//     }
// }
