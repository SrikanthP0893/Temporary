import { moduleMetadata, Story, Meta } from '@storybook/angular';
import {
  MultiSelectWrapperComponent,
  MultiSelectWrapperComponentModule,
} from './multi-select-wrapper.component';

export default {
  title: 'Design System/MultiSelectWrapperComponent',
  component: MultiSelectWrapperComponent,
  argTypes: {
    isSearchIconEnable: {
      type: "boolean"
    }
  },
  decorators: [
    moduleMetadata({
      imports: [MultiSelectWrapperComponentModule],
    }),
  ],
} as Meta<MultiSelectWrapperComponent>;

const Template: Story<MultiSelectWrapperComponent> = (
  args: MultiSelectWrapperComponent
) => ({
  props: args,
  template: '<k-multi-select-wrapper [isSearchIconEnable]="isSearchIconEnable"></k-multi-select-wrapper>',
});

export const Primary = Template.bind({});
Primary.args = {};
