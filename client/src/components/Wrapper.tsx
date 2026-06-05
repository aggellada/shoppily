import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

function Wrapper({ children }: Props) {
  return (
    <div className="w-full h-screen bg-red-300">
      <div className="m-auto w-full max-w-5xl h-full bg-blue-400">{children}</div>
    </div>
  );
}

export default Wrapper;
