import BaseButton from './BaseButton/BaseButton';
import BaseTextarea from './BaseTextarea/BaseTextarea';
import BaseCheckbox from './BaseCheckbox/BaseCheckbox';
import BaseSwitch from './BaseSwitch/BaseSwitch';
import BaseColorPicker from './BaseColorPicker/BaseColorPicker';
import BaseInput from './BaseInput/BaseInput';
import BaseSelect from './BaseSelect/BaseSelect';
import GaugeSegmentBuilder from './GaugeSegmentBuilder/GaugeSegmentBuilder';
import DataSourceSelect from './DataSourceSelect/DataSourceSelect';
import BaseLabel from './BaseLabel/BaseLabel';
import BaseLink from './BaseLink/BaseLink';
import BaseIconButton from './BaseIconButton/BaseIconButton';
import BaseChip from './BaseChip/BaseChip';
import BaseTabs from './BaseTabs/BaseTabs';
import BaseTooltip from './BaseTooltip/BaseTooltip';
import BaseRadio from './BaseRadio/BaseRadio';
import BaseRadioGroup from './BaseRadioGroup/BaseRadioGroup';

export default [
  { name: 'base-button', baseClass: BaseButton },
  { name: 'base-textarea', baseClass: BaseTextarea },
  { name: 'base-checkbox', baseClass: BaseCheckbox },
  { name: 'base-switch', baseClass: BaseSwitch },
  { name: 'base-color-picker', baseClass: BaseColorPicker },
  { name: 'base-input', baseClass: BaseInput },
  { name: 'base-select', baseClass: BaseSelect },
  { name: 'base-label', baseClass: BaseLabel },
  { name: 'base-link', baseClass: BaseLink },
  { name: 'base-icon-button', baseClass: BaseIconButton },
  { name: 'base-chip', baseClass: BaseChip },
  { name: 'base-tabs', baseClass: BaseTabs },
  { name: 'base-tooltip', baseClass: BaseTooltip },
  { name: 'base-radio', baseClass: BaseRadio },
  { name: 'base-radio-group', baseClass: BaseRadioGroup },
  { name: 'datasource-select', baseClass: DataSourceSelect },
  { name: 'gauge-segment-builder', baseClass: GaugeSegmentBuilder },
];
