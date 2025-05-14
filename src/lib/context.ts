import { getContext, setContext } from 'svelte';
import type { Network } from './types';

const networkKey = Symbol("networkKey");

export function setNetworkContext(network: Network) {
  setContext(networkKey, network);
}

export function getNetworkContext() {
  return getContext(networkKey) as Network;
}

