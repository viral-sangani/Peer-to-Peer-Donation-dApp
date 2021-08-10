import { Dialog, Transition } from "@headlessui/react";
import { create } from "ipfs-http-client";
import { Fragment, useState } from "react";
import { useData } from "../contexts/DataContext";
import { TextArea } from "./TextArea";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

export const UploadImage: React.FC<Props> = ({ isOpen, closeModal }) => {
  const [buttonTxt, setButtonTxt] = useState<string>("Upload");
  const [file, setFile] = useState<File | null>(null);
  const { contract, account, updateImages } = useData();
  const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });
  const [description, setDescription] = useState<string>("");

  const uploadImage = async () => {
    setButtonTxt("Uploading to IPFS...");
    const added = await client.add(file);
    setButtonTxt("Creating smart contract...");
    contract.methods
      .uploadImage(added.path, description)
      .send({ from: account })
      .then(async () => {
        await updateImages();
        setFile(null);
        setDescription("");
        setButtonTxt("Upload");
        closeModal();
      })
      .catch(() => {
        closeModal();
      });
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />

          <div className="min-h-screen px-4 text-center ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl  max-w-xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Upload Image to IPFS
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    onChange={(e) => setFile(e.target.files[0])}
                    className="my-3"
                    type="file"
                  />
                </div>

                {file && (
                  <div className="mt-2">
                    <img src={URL.createObjectURL(file)} />
                  </div>
                )}

                <div className="mt-4">
                  <TextArea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    varient="ongray"
                    placeholder="Description"
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    disabled={buttonTxt !== "Upload"}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => {
                      if (file) uploadImage();
                    }}
                  >
                    {buttonTxt}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
