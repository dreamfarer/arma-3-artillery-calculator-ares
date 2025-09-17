import React from 'react';
import { ArtilleryFeatureProperties } from '@/types/artillery-feature-properties';
import { TargetFeatureProperties } from '@/types/target-feature-properties';
import styles from './popup.module.css';

type PopupProps = {
  properties: ArtilleryFeatureProperties | TargetFeatureProperties;
};

export default function Popup({ properties }: Readonly<PopupProps>) {
  if (properties.markerType === 'target') {
    const { azimuth, direct, indirect, fireMode } = properties;
    return (
      <div className={styles.body}>
        <div className={styles.title}>Target</div>
        <div className={styles.content}>
          <div className={styles.side}>
            <div className={styles.item}>
              <div className={styles.key}>azimuth:</div>
              <div className={styles.value}>{azimuth.toFixed(2)}°</div>
            </div>
            <div className={styles.item}>
              <div className={styles.key}>mode:</div>
              <div className={styles.value}>{fireMode}</div>
            </div>
          </div>
          <div className={styles.side}>
            <div className={styles.item}>
              <div className={styles.key}>direct:</div>
              <div className={styles.value}>{direct.toFixed(2)}°</div>
            </div>
            <div className={styles.item}>
              <div className={styles.key}>indirect:</div>
              <div className={styles.value}>{indirect.toFixed(2)}°</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.body}>
      <div className={styles.title}>Artillery Unit</div>
    </div>
  );
}
