import { getContext, setContext } from 'svelte';
import type { Network } from './types';

const networkKey = Symbol("key");

export function setNetworkContext(network: Network) {
  setContext(networkKey, network);
}

export function getNetworkContext() {
  return getContext(networkKey) as Network;
}
