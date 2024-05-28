<script lang="ts" context="module">
  const rpcUrl = "/alchemy-rpc/v2";

  const config = createConfig({
    rpcUrl,
    chain: polygonAmoy,
    ssr: true,
    storage: cookieStorage,
  });
</script>

<script lang="ts">
  import { onMount } from "svelte";

  import {
    cookieStorage,
    cookieToInitialState,
    createAccount,
    createConfig,
    getAccount,
    getBundlerClient,
    getSigner,
    hydrate,
    watchAccount,
    watchSigner,
  } from "@alchemy/aa-alchemy/config";

  import {
    polygonAmoy,
    type SmartAccountClient,
    type SmartAccountSigner,
  } from "@alchemy/aa-core";

  import type { MouseEventHandler } from "svelte/elements";
  import type { PageData } from "./$types";

  export let data: PageData;

  // const clientStore = writable<SmartAccountClient | undefined>(undefined);
  const initialState = cookieToInitialState(config, data.cookie ?? undefined);
  const { onMount: hydrateOnMount } = hydrate(config, initialState);

  const logInUsingPasskey: MouseEventHandler<HTMLButtonElement> = async () => {
    await hydrateOnMount();

    const signer = getSigner(config);
    if (!signer) throw "No signer";

    await signer.authenticate({
      type: "passkey",
      createNew: false,
    });

    console.log(
      await createAccount({ type: "MultiOwnerModularAccount" }, config),
    );
  };

  onMount(async () => {
    console.log("onmount", await hydrateOnMount());
  });
</script>

<button on:click={logInUsingPasskey}>Log In</button>

<pre>
<!-- {JSON.stringify(getAccount({ type: "MultiOwnerModularAccount" }, config))} -->
</pre>

<pre>
<!-- {JSON.stringify(getSigner(config))} -->
</pre>

<div id="alchemy-iframe-container"></div>
