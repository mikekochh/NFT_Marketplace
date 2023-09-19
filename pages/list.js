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
  const [hasClearedImage, setHasClearedImage] = useState(false);
  const [formInput, setFormInput] = useState({ price: '', name: '', description: '', image: '', tokenId: '' });
  const { theme } = useTheme();
  const { uploadToIPFS, listProperty } = useContext(RealEstateContext);
  const router = useRouter();
  let hasExecuted = false;

  const relistOrList = router.query.name ? 'relist' : 'list';

  if (relistOrList === 'list' && formInput.tokenId !== '') {
    setFormInput({ price: '', name: '', description: '', image: '', tokenId: '' });
    setFileUrl(null);
  }

  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFS(acceptedFile);
    setFileUrl(url);
    setHasClearedImage(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5000000,
  });

  const clearImage = () => {
    setFileUrl(null);
    setHasClearedImage(true);
  };

  useEffect(() => {
    if (!router.isReady || hasExecuted) return;
    setFormInput(router.query);
    hasExecuted = true;
  }, [router.isReady]);

  if (formInput.image && formInput.image.length !== 0 && !fileUrl && !hasClearedImage) {
    setFileUrl(formInput.image);
  }

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
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4 flex-1">{relistOrList === 'relist' ? 'Relist Property' : 'List New Property' }</h1>
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
                <span onClick={() => clearImage()}><Image src={images.trash} width={100} height={100} className="cursor-pointer" /></span>
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
          <Button
            btnName={relistOrList === 'relist' ? 'Relist Property' : 'List Property'}
            classStyles="rounded-xl"
            handleClick={() => listProperty(formInput, fileUrl, router, relistOrList)}
          />
        </div>
      </div>
    </div>
  );
};

export default List;
