<script context="module">
  import IconFont, { createFromIconfontScriptCN } from "./iconFont";
  const _primaryColor = "#1890ff";
  export function setTwoToneColor(primaryColor) {
    _primaryColor = primaryColor;
  }

  export function getTwoToneColor() {
    return _primaryColor;
  }
  export function createFromIconfontCN(options) {
    createFromIconfontScriptCN(options);
    return IconFont;
  }
</script>

<script>
  import { AccountBookFill } from "@ant-design/icons";
  import { generate as generateColor } from "@ant-design/colors";
  import { renderIconDefinitionToSVGElement } from "@ant-design/icons/lib/helpers";
  import * as allIcons from "@ant-design/icons/lib/dist";
  import tooltip from "../tooltip";

  let tooltipConfig;
  export { tooltipConfig as tooltip };

  import {
    svgBaseProps,
    withThemeSuffix,
    removeTypeTheme,
    getThemeFromTypeName,
    alias
  } from "./utils";
  import classNames, { formatStyle } from "../_util/classes";
  import warning from "../_util/warning";

  let className;
  export { className as class };
  export let type;
  export let spin;
  export let theme;
  export let rotate;
  export let twoToneColor;
  export let style = {};

  let defaultTheme = "outlined";
  let iconSvg;
  let classString;
  let extraSVGAttrs;
  $: {
    classString = classNames(
      {
        [`anticon`]: true,
        [`anticon-${type}`]: Boolean(type)
      },
      className
    );
    extraSVGAttrs = {
      ...svgBaseProps,
      class: classNames({
        [`anticon-spin`]: !!spin || type === "loading"
      }),
      style: formatStyle({
        transform: rotate ? `rotate(${rotate}deg)` : null
      })
    };
    if (typeof type === "string") {
      let computedType = type;
      if (theme) {
        const themeInName = getThemeFromTypeName(type);
        warning(
          !themeInName || theme === themeInName,
          "Icon",
          `The icon name '${type}' already specify a theme '${themeInName}',` +
            ` the 'theme' prop '${theme}' will be ignored.`
        );
      }
      computedType = withThemeSuffix(
        removeTypeTheme(alias(computedType)),
        theme || defaultTheme
      );
      const primaryColor = twoToneColor || getTwoToneColor();
      iconSvg = renderIconDefinitionToSVGElement(allIcons[computedType], {
        extraSVGAttrs,
        placeholders: {
          primaryColor,
          secondaryColor: generateColor(primaryColor)[0]
        }
      });
    }
  }
  let havSlot = !!$$props.$$slots;
  let isDefault = havSlot && $$props.$$slots.default;
  let isOnlyPath = havSlot && $$props.$$slots["only-path"];
</script>

<i
  class={classString}
  aria-label={type}
  style={formatStyle(style)}
  on:click
  on:mouseout
  use:tooltip={tooltipConfig}>
  {#if iconSvg}
    {@html iconSvg}
  {:else if isOnlyPath}
    <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
      <slot name="only-path" />
    </svg>
  {:else if isDefault}
    <slot />
  {/if}
</i>
