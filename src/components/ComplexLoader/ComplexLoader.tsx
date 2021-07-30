import { Progress, Typography } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { animated, config, useTransition } from 'react-spring';

// @ts-ignore
import styles from './ComplexLoader.module.less';
import logo from './images/logo.svg';
import If from '../If';

interface ComplexLoaderProps {
  children: ReactElement | ReactElement[];
  labels?: string[];
  onFinish: any;
}

const defaultLabels = [
  'Verifying participants',
  'Collecting prizes',
  'Selecting the lucky winners',
  'Saving winners and prizes',
];

export const ComplexLoader = ({ children, labels, onFinish }: ComplexLoaderProps) => {
  const [progress, setProgress] = useState([0, 0, 0, 0]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setProgress([0, 0, 0, 0]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newValues = [...oldProgress];

        const step = 8;

        newValues[0] = Math.min(newValues[0] + Math.random() * step, 100);

        if (newValues[0] > 70) {
          newValues[1] = Math.min(newValues[1] + Math.random() * step, 100);
        }

        if (newValues[1] > 95) {
          newValues[2] = Math.min(newValues[2] + Math.random() * step, 100);
        }

        if (newValues[2] > 95) {
          newValues[3] = Math.min(newValues[3] + Math.random() * step, 100);
        }

        return newValues;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!finished && Math.min(...progress) === 100) {
      onFinish();
      setFinished(true);
    }
  }, [progress, finished]);

  const transitions = useTransition(Math.min(...progress) === 100, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: false,
    delay: 200,
    config: config.molasses,
    // onRest: () => set(!toggle),
  });

  // return transitions(({ opacity }: any, item: any) =>
  //   item ? (
  //     <animated.div
  //       style={{
  //         opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }),
  //       }}
  //     >
  //       {children}
  //     </animated.div>
  //   ) : (
  //     <animated.div
  //       style={{
  //         width: '100%',
  //         position: 'absolute',
  //         opacity: opacity.to({ range: [1.0, 0.0], output: [1, 0] }),
  //       }}
  //     >
  //       <div className={styles.root}>
  //         <div className={styles.loaders}>
  //           <div className={styles.logoContainer}>
  //             <img src={logo} className={styles.logo} />
  //           </div>
  //
  //           {progress.map((value, index) => (
  //             <div className={styles.row} key={index}>
  //               <Typography.Paragraph
  //                 className={styles.loaderLabel}
  //                 style={{ opacity: value === 0 ? 0.5 : 1 }}
  //               >
  //                 {(labels || defaultLabels)[index]}
  //               </Typography.Paragraph>
  //               <Progress percent={Math.floor(value)} key={index} className={styles.loader} />
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </animated.div>
  //   ),
  // );

  return (
    <If
      condition={Math.min(...progress) === 100}
      then={() => children}
      else={() => (
        <div className={styles.root}>
          <div className={styles.loaders}>
            {/*<div className={styles.logoContainer}>*/}
            {/*  <img src={logo} className={styles.logo} />*/}
            {/*</div>*/}

            {progress.map((value, index) => (
              <div className={styles.row} key={index}>
                <Typography.Paragraph
                  className={styles.loaderLabel}
                  style={{ opacity: value === 0 ? 0.5 : 1 }}
                >
                  {(labels || defaultLabels)[index]}
                </Typography.Paragraph>
                <Progress percent={Math.floor(value)} key={index} className={styles.loader} />
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
};

export default ComplexLoader;
