import { useEffect } from 'react';

export const useScript = url => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [url]);
};

export const AddingScript = (url) => {
  return new Promise((res, rej) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
    setTimeout(() => {
      console.log('cargando script')
    }, 2000);
    res()
  })
}

