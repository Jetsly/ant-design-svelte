<script>
  import { AccountBookFill } from "@ant-design/icons";
  import { renderIconDefinitionToSVGElement } from "@ant-design/icons/lib/helpers";
  import * as allIcons from "@ant-design/icons/lib/dist";
  import {
    svgBaseProps,
    withThemeSuffix,
    removeTypeTheme,
    getThemeFromTypeName,
    alias
  } from "./utils";
  console.log(allIcons);
  import classNames from "../_util/classes";
  let className;
  export { className as class };
  export let type;
  export let spin;

  let iconSvg;
  let classString;
  $: {
    classString = classNames(
      {
        [`anticon`]: true,
        [`anticon-${type}`]: Boolean(type)
      },
      className
    );
    iconSvg = renderIconDefinitionToSVGElement(AccountBookFill, {
      extraSVGAttrs: {
        class: classNames({
          [`anticon-spin`]: !!spin || type === "loading"
        }),
        width: "1em",
        height: "1em",
        fill: "currentColor"
      }
    });
  }
</script>

<i class={classString} aria-label={type} on:click>
  {@html iconSvg}
</i>
