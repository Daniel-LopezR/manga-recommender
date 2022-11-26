import { MouseEventHandler } from "react";
import { inferQueryResponse } from "../api/trpc/[trpc]";

type GenreFromServer = inferQueryResponse<"get-all-genres">;
type DemoFromServer = inferQueryResponse<"get-all-demographics">;

const isCorrectType = (t: GenreFromServer | DemoFromServer) => (t as GenreFromServer)[0].name === "Action";

const OptionsGenerator: React.FC<{
  dataFS: GenreFromServer | DemoFromServer;
}> = (props) => {
  const checkOption: MouseEventHandler<HTMLDivElement> = (optionClicked) => {
    let classList = optionClicked.currentTarget.children[0].classList;
    if(classList.contains("base")){
      classList.remove("base");
      classList.add("included");
    }else if(classList.contains("included")){
      classList.remove("included");
      classList.add("excluded");
    }else{
      classList.remove("excluded");
      classList.add("base");
    }
  };


  return (
    <div className="flex flex-col w-2/4">
      <div className="text-center p-2">{(isCorrectType(props.dataFS)) ? "Genres" : "Demographics"}</div>
      <div className="flex flex-wrap flex-row justify-around gap-2">
        {props.dataFS &&
          props.dataFS.map((item) => {
            return (
              <div className="aux p-2 text-center border rounded-3xl transition cursor-pointer" key={`${item.id}-label`} onClick={checkOption}>
                <div className="base peer inline-block" key={`${item.id}-name`}>{item.name}</div>
                <div className="pl-1 text-green-500 hidden peer-[.included]:inline-block" key={`${item.id}-tick`}>&#10003;</div>
                <div className="pl-1 text-red-500 hidden peer-[.excluded]:inline-block" key={`${item.id}-cross`}>&#10007;</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default OptionsGenerator;
