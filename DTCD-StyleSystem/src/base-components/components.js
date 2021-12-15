import BaseButton from './BaseButton/BaseButton';
import BaseTextarea from './BaseTextarea/BaseTextarea';
import BaseCheckbox from './BaseCheckbox/BaseCheckbox';
import BaseSwitch from './BaseSwitch/BaseSwitch';
import BaseColorPicker from './BaseColorPicker/BaseColorPicker';
import BaseInput from './BaseInput/BaseInput';
import BaseSelect from './BaseSelect/BaseSelect';
import GaugeSegmentBuilder from './GaugeSegmentBuilder/GaugeSegmentBuilder';

export default [
  { name: 'base-button', baseClass: BaseButton },
  { name: 'base-textarea', baseClass: BaseTextarea },
  { name: 'base-checkbox', baseClass: BaseCheckbox },
  { name: 'base-switch', baseClass: BaseSwitch },
  { name: 'base-color-picker', baseClass: BaseColorPicker },
  { name: 'base-input', baseClass: BaseInput },
  { name: 'base-select', baseClass: BaseSelect },
  { name: 'gauge-segment-builder', baseClass: GaugeSegmentBuilder },
];
