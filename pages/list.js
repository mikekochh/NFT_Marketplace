import { useState, useMemo, useCallback, useContext, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';

import { RealEstateContext } from '../context/RealEstateContext';
import { Button, Input } from '../components';
import images from '../assets';

const List = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({ price: '', name: '', description: '', image: '' });
  const { theme } = useTheme();
  const { uploadToIPFS, listProperty } = useContext(RealEstateContext);
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFS(acceptedFile);

    setFileUrl(url);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5000000,
  });

  useEffect(() => {
    if (!router.isReady) return;
    setFormInput(router.query); // router.query is an object that contains the query string parameters
    // setIsLoading(false);
  }, [router.isReady]);

  if (formInput.image.length !== 0) {
    setFileUrl(formInput.image);
  }

  // only when one of the isDrag changes do we re-render this function, instead of hav
  const fileStyle = useMemo(() => (
    `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed
    ${isDragActive && ' border-file-active'}
    ${isDragAccept && ' border-file-accept'}
    ${isDragReject && ' border-file-reject'}
    `
  ), [isDragActive, isDragAccept, isDragReject]);

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4 flex-1">List New Property</h1>
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl">{fileUrl ? 'Property Image' : 'Upload Property Image' }</p>
          <div className="mt-4">
            {!fileUrl ? (
              <div {...getRootProps()} className={fileStyle}>
                <input {...getInputProps()} />
                <div className="flexCenter flex-col text-center">
                  <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">JPG, PNG, GIF, SVG, WEBM, Max 5mb</p>
                  <div className="my-12 w-full flex justify-center">
                    <Image
                      src={images.upload}
                      width={100}
                      height={100}
                      objectFit="contain"
                      alt="file upload"
                      className={theme === 'light' && 'filter invert'}
                    />
                  </div>
                  <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">Drag and Drop File</p>
                  <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">or Browse media on your device</p>
                </div>
              </div>
            ) : (
              <div>
                <Image src={fileUrl} width={256} height={256} alt="asset_file" />
              </div>
            )}
          </div>
        </div>

        <Input
          inputType="input"
          title="Address"
          placeholder="Property Address"
          value={formInput.name}
          handleClick={(e) => setFormInput({ ...formInput, name: e.target.value })}
        />
        <Input
          inputType="textarea"
          title="Description"
          placeholder="Property Description"
          value={formInput.description}
          handleClick={(e) => setFormInput({ ...formInput, description: e.target.value })}
        />
        <Input
          inputType="number"
          title="Price"
          placeholder="Listed Price"
          value={formInput.price}
          handleClick={(e) => setFormInput({ ...formInput, price: e.target.value })}
        />
        <div className="mt-7 w-full flex justify-end">
          <Button btnName="List Property" classStyles="rounded-xl" handleClick={() => listProperty(formInput, fileUrl, router)} />
        </div>
      </div>
    </div>
  );
};

export default List;
