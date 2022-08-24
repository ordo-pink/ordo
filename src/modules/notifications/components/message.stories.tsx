import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Provider } from "react-redux";
import { store } from "@core/state/store";

import { Message } from "./message";

import "../../../index.css";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Message",
  component: Message,
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Message>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Message> = (args) => <Message {...args} />;

export const Error = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Error.args = {
  message: {
    type: "error",
    title: "error title example",
    content:
      "error content example: Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups",
  },
  index: 1,
};

export const Info = Template.bind({});
Info.args = {
  message: {
    type: "info",
    title: "info title example",
    content:
      "info content example: Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups",
  },
  index: 1,
};

export const Success = Template.bind({});
Success.args = {
  message: {
    type: "success",
    title: "success title example",
    content:
      "success content example: Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups",
  },
  index: 1,
};

export const Warning = Template.bind({});
Warning.args = {
  message: {
    type: "warning",
    title: "Warning title example",
    content:
      "Warning content example: Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups",
  },
  index: 1,
};
