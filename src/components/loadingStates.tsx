import { RotatingLines } from "react-loader-spinner";

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <RotatingLines strokeColor="black" strokeWidth="4" animationDuration="0.75" width="96" visible={true} />
  </div>
);

export const UnauthorizedState = () => (
  <div className="flex items-center justify-center h-screen text-2xl font-bold">
    You do not have permissions to view this page
  </div>
);

export const ErrorState = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-screen text-2xl font-bold text-red-500">`{message}</div>
);
