<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  import {
    AlchemySigner,
    createModularAccountAlchemyClient,
  } from "@alchemy/aa-alchemy";

  import {
    cookieStorage,
    cookieToInitialState,
    createConfig,
    getAccount,
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

  const clientStore = writable<SmartAccountClient | undefined>(undefined);
  const rpcUrl = "/alchemy-rpc";

  const config = createConfig({
    rpcUrl,
    chain: polygonAmoy,
    ssr: true,
    storage: cookieStorage,
  });

  const initialState = cookieToInitialState(config, data.cookie ?? undefined);
  const { onMount: hydrateOnMount } = hydrate(config, initialState);

  const createClient = (signer: SmartAccountSigner) =>
    createModularAccountAlchemyClient({
      signer,
      chain: polygonAmoy,
      gasManagerConfig: { policyId: "" },
      rpcUrl: "/alchemy-rpc/v2",
    });

  const logInUsingPasskey: MouseEventHandler<HTMLButtonElement> = async () => {
    const signer = new AlchemySigner({
      client: {
        connection: { rpcUrl },
        iframeConfig: { iframeContainerId: "alchemy-iframe-container" },
      },
    });

    const user = await signer.getAuthDetails().catch(() => null);
    console.log(user);

    await signer.authenticate({
      type: "passkey",
      createNew: false,
    });

    clientStore.set(await createClient(signer));
  };

  const onAccountChange = watchAccount("MultiOwnerModularAccount", config);

  const onSignerChange = watchSigner(config);

  onMount(async () => {
    hydrateOnMount();

    // onAccountChange((account) => console.log("account", account));

    onSignerChange(async (signer) => {
      console.log("signer", signer);
      if (signer) clientStore.set(await createClient(signer));
    });
  });
</script>

{#if $clientStore}
  Logged in
{:else}
  <button on:click={logInUsingPasskey}>Log In</button>
{/if}

<pre>
{JSON.stringify(getAccount({ type: "MultiOwnerModularAccount" }, config))}
</pre>

<pre>
{JSON.stringify(getSigner(config))}
</pre>

<div id="alchemy-iframe-container"></div>
