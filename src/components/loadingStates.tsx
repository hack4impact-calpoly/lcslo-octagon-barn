import { RotatingLines } from "react-loader-spinner";

export const LoadingSpinner = () => (
  <div className="absolute left-1/2 bottom-[300px] -translate-x-1/2">
    <RotatingLines strokeColor="black" strokeWidth="4" animationDuration="0.75" width="96" visible={true} />
  </div>
);

export const UnauthorizedState = () => (
  <div className="flex items-center justify-center h-screen text-2xl font-bold">
    You do not have permissions to view this page
  </div>
);

export const ErrorState = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-screen text-2xl font-bold text-black-500">{message}</div>
);
