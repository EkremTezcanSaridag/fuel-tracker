const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    status,
  })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ message: 'Only POST requests are supported.', status: 'error' }, 405)
  }

  const token = Deno.env.get('GITHUB_ACTION_TOKEN')
  const owner = Deno.env.get('GITHUB_OWNER') ?? 'EkremTezcanSaridag'
  const repo = Deno.env.get('GITHUB_REPO') ?? 'fuel-tracker'
  const workflow = Deno.env.get('GITHUB_WORKFLOW') ?? 'guncelle.yml'
  const ref = Deno.env.get('GITHUB_REF') ?? 'main'

  if (!token) {
    return jsonResponse(
      {
        message: 'GITHUB_ACTION_TOKEN secret is missing.',
        status: 'error',
      },
      500,
    )
  }

  const dispatchUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`

  try {
    const response = await fetch(dispatchUrl, {
      body: JSON.stringify({ ref }),
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'YakitRadarRefreshFunction',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      method: 'POST',
    })

    if (!response.ok) {
      const details = await response.text()

      return jsonResponse(
        {
          details,
          message: `GitHub workflow dispatch failed with ${response.status}.`,
          status: 'error',
        },
        502,
      )
    }

    return jsonResponse({
      message: 'Price refresh workflow queued.',
      queuedAt: new Date().toISOString(),
      status: 'queued',
    })
  } catch (error) {
    return jsonResponse(
      {
        message: error instanceof Error ? error.message : 'Unknown refresh trigger error.',
        status: 'error',
      },
      500,
    )
  }
})
