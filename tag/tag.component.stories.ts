import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { IconComponentModule } from '../icon/icon.component';
import { TagComponent } from './tag.component';
import { CheckboxComponentModule } from '../checkbox/checkbox.component';
import { AvatarComponentModule } from '../avatar/avatar.component';

export default {
  title: 'Design System/TagComponent',
  component: TagComponent,
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
    closable: {
      type: 'boolean',
    },
    clickable: {
      type: 'boolean',
    },
    value: {
      type: 'number',
    },
    avatarUrl: {
      type: 'string',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        IconComponentModule,
        CheckboxComponentModule,
        AvatarComponentModule,
      ],
    }),
  ],
} as Meta<TagComponent>;

const Template: Story<TagComponent> = (args: TagComponent) => ({
  props: args,
  template: `<k-tag [size]="size" [closable]="closable" [avatarUrl]="avatarUrl" [clickable]="clickable" [value]="value">Label</k-tag>`,
});

export const Tag = Template.bind({});
Tag.args = {
  size: 'lg',
};

export const TagClosable = Template.bind({});
TagClosable.args = {
  size: 'lg',
  closable: true,
};

export const TagWithCheckbox = Template.bind({});
TagWithCheckbox.args = {
  size: 'lg',
  clickable: true,
};

export const TagWithNumber = Template.bind({});
TagWithNumber.args = {
  size: 'lg',
  value: 5,
};
