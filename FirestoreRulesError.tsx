

import React from 'react';
import { CheckIcon } from './icons/CheckIcon.tsx';

interface FeatureListItemProps {
  text: string;
}

const FeatureListItem: React.FC<FeatureListItemProps> = ({ text }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 pt-1">
        <CheckIcon className="w-5 h-5 text-green-400" />
      </div>
      <p className="text-violet-200">{text}</p>
    </div>
  );
};

export default FeatureListItem;