import { useState, useMemo, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { Button } from '../components';
import images from '../assets';

const List = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const { theme } = useTheme();

  const onDrop = () => {
    // upload image to the ipfs
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop: onDrop(),
  });

  const fileStyle = useMemo(() => (
    ''
  ), []);

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4 flex-1">List New Property</h1>
      <div className="mt-16">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">Upload Files</p>
      </div>
    </div>
  );
};

export default List;
