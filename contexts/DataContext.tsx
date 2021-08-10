declare let window: any;
import { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";
import Decentragram from "../abis/Decentragram.json";
interface DataContextProps {
  account: string;
  contract: any;
  loading: boolean;
  images: any[];
  imageCount: number;
  updateImages: () => Promise<void>;
  tipImageOwner: (id: string, tipAmout: any) => Promise<void>;
}

const DataContext = createContext<DataContextProps | null>(null);

export const DataProvider: React.FC = ({ children }) => {
  const data = useProviderData();

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => useContext<DataContextProps>(DataContext);

export const useProviderData = () => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const [account, setAccount] = useState("0x0");
  const [contract, setContract] = useState<any>();

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Eth browser detected. Please consider using MetaMask.");
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    var allAccounts = await web3.eth.getAccounts();
    setAccount(allAccounts[0]);
    const networkId = await web3.eth.net.getId();
    const networkData = Decentragram.networks[networkId];
    if (networkData) {
      var tempContract = new web3.eth.Contract(
        Decentragram.abi,
        networkData.address
      );
      setContract(tempContract);
      var count = await tempContract.methods.imageCount().call();
      setImageCount(count);
      var tempImageList = [];
      for (var i = 1; i <= count; i++) {
        const image = await tempContract.methods.images(i).call();
        tempImageList.push(image);
      }
      tempImageList.reverse();
      setImages(tempImageList);
    } else {
      window.alert("TestNet not found");
    }
    setLoading(false);
  };

  const updateImages = async () => {
    setLoading(true);
    if (contract !== undefined) {
      var count = await contract.methods.imageCount().call();
      setImageCount(count);
      var tempImageList = [];
      for (var i = 1; i <= count; i++) {
        const image = await contract.methods.images(i).call();
        tempImageList.push(image);
      }
      tempImageList.reverse();
      setImages(tempImageList);
      setLoading(false);
    }
  };

  const tipImageOwner = async (id: string, tipAmout) => {
    var res = await contract.methods
      .tipImageOwner(id)
      .send({ from: account, value: tipAmout });
  };

  return {
    account,
    contract,
    loading,
    images,
    imageCount,
    updateImages,
    tipImageOwner,
  };
};
