<script>
  import classNames, { formatStyle } from "../_util/classes";

  export let title;
  export let placement;
  export let visible;
  export let style;
</script>

<div
  class={classNames('ant-tooltip', `ant-tooltip-placement-${placement}`, {
    'ant-tooltip-hidden': !visible,
  })}
  style={formatStyle(style)}>
  <div class="ant-tooltip-content">
    <div class="ant-tooltip-arrow" />
    <div class="ant-tooltip-inner" role="tooltip">{title}</div>
  </div>
</div>
