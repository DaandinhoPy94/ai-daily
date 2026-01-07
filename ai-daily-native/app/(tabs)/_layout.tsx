import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      tintColor="#E36B2C"
      // Hardware-accelerated Liquid Glass: null background + system blur
      backgroundColor={null}
      blurEffect="systemMaterial"
      disableTransparentOnScrollEdge={false}
    >
      {/* Visible Tabs */}
      <NativeTabs.Trigger name="index">
        <Icon sf="house.fill" />
        <Label>Voorpagina</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="net-binnen">
        <Icon sf="clock.fill" />
        <Label>Net binnen</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="mijn-nieuws">
        <Icon sf="heart.fill" />
        <Label>Mijn nieuws</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="meer">
        <Icon sf="ellipsis" />
        <Label>Meer</Label>
      </NativeTabs.Trigger>

      {/* Hidden Tabs */}
      <NativeTabs.Trigger name="profile" hidden>
        <Icon sf="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="opgeslagen" hidden>
        <Icon sf="bookmark.fill" />
        <Label>Opgeslagen</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="preferences" hidden>
        <Icon sf="gearshape.fill" />
        <Label>Preferences</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}