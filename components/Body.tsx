declare let window: any;
import Identicon from "identicon.js";
import React from "react";
import { useData } from "../contexts/DataContext";

const Body = () => {
  const { images } = useData();
  return (
    <>
      {images.length > 0 &&
        images.map((image, index) => (
          <BodyItem
            key={index}
            totalTips={image.tipAmount}
            address={image.author}
            description={image.description}
            hash={image.hash}
            id={image.id}
          />
        ))}
    </>
  );
};

export default Body;

const BodyItem = ({ address, description, totalTips, hash, id }) => {
  const { tipImageOwner, updateImages } = useData();
  var data = new Identicon(address, 200).toString();
  return (
    <div className="w-full md:mx-0 md:max-w-2xl mt-5 p-3 border rounded-xl flex flex-col">
      <div className="flex flex-row space-x-5 bg-gray-100 rounded-t-xl py-3 px-4 border-t border-l border-r font-mono items-center">
        <img width={35} height={35} src={`data:image/png;base64, ${data}`} />
        <div className="overflow-ellipsis w-52 overflow-hidden">{address}</div>
      </div>
      <img src={`https://ipfs.infura.io/ipfs/${hash}`} />
      <div className="py-3 px-4 flex flex-col border-l border-r">
        <span className="font-sans font-bold">Description</span>
        <span className="font-sans pt-2">{description}</span>
      </div>
      <div className="bg-gray-100 rounded-b-xl py-3 px-4 border-b border-l border-r font-mono flex flex-row justify-between">
        <span>
          Total TIPS: {window.web3.utils.fromWei(totalTips, "Ether")} MATIC
        </span>
        <div
          onClick={async () => {
            let tipAmount = window.web3.utils.toWei("0.1", "Ether");
            await tipImageOwner(id, tipAmount);
            await updateImages();
          }}
        >
          <span className="cursor-pointer font-bold text-blue-400">
            TIPS: 0.1 MATIC
          </span>
        </div>
      </div>
    </div>
  );
};
