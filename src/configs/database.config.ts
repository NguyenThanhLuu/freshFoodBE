import { connect, ConnectOptions } from "mongoose";

export const dbConnect = () => {
  connect(process.env.DATABASE!, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  } as ConnectOptions).then(
    (success) => console.log("connect successfully"),
    (error) => console.log(error)
  );
};
