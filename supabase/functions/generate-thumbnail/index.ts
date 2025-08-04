import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { fileUrl, fileName, fileType, materialId } = await req.json()
    
    if (!fileUrl || !fileName || !materialId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: fileUrl, fileName, materialId' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Generating thumbnail for:', { fileUrl, fileName, fileType, materialId })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    let thumbnailBlob: Blob | null = null
    let thumbnailFileName = `${materialId}_thumbnail.jpg`

    // Generate thumbnail based on file type
    if (fileType?.startsWith('image/')) {
      // For images, fetch and resize them
      console.log('Processing image file...')
      const response = await fetch(fileUrl)
      if (!response.ok) {
        throw new Error('Failed to fetch image file')
      }
      
      const imageBlob = await response.blob()
      
      // Create a simple thumbnail by using the original image
      // In production, you might want to resize it
      thumbnailBlob = imageBlob
      
    } else if (fileType?.startsWith('video/')) {
      // For videos, we'll create a placeholder thumbnail
      // In production, you'd extract the first frame using ffmpeg
      console.log('Processing video file...')
      
      // Create a simple colored rectangle as placeholder
      const canvas = new OffscreenCanvas(400, 300)
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 400, 300)
        gradient.addColorStop(0, '#667eea')
        gradient.addColorStop(1, '#764ba2')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 400, 300)
        
        // Add play icon
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.moveTo(150, 100)
        ctx.lineTo(150, 200)
        ctx.lineTo(250, 150)
        ctx.closePath()
        ctx.fill()
        
        // Add text
        ctx.fillStyle = 'white'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('Video Preview', 200, 250)
        
        thumbnailBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 })
      }
      
    } else if (fileType === 'application/pdf') {
      // For PDFs, create a placeholder thumbnail
      console.log('Processing PDF file...')
      
      const canvas = new OffscreenCanvas(400, 300)
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        // Create document-like background
        ctx.fillStyle = '#f8f9fa'
        ctx.fillRect(0, 0, 400, 300)
        
        // Add border
        ctx.strokeStyle = '#dee2e6'
        ctx.lineWidth = 2
        ctx.strokeRect(10, 10, 380, 280)
        
        // Add PDF icon representation
        ctx.fillStyle = '#dc3545'
        ctx.fillRect(50, 50, 300, 40)
        
        ctx.fillStyle = '#6c757d'
        ctx.fillRect(50, 110, 300, 8)
        ctx.fillRect(50, 130, 250, 8)
        ctx.fillRect(50, 150, 280, 8)
        ctx.fillRect(50, 170, 200, 8)
        
        // Add text
        ctx.fillStyle = '#495057'
        ctx.font = '20px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('PDF Document', 200, 250)
        
        thumbnailBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 })
      }
      
    } else {
      // For other file types, create a generic thumbnail
      console.log('Processing generic file...')
      
      const canvas = new OffscreenCanvas(400, 300)
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        // Create generic file background
        ctx.fillStyle = '#e9ecef'
        ctx.fillRect(0, 0, 400, 300)
        
        // Add file icon representation
        ctx.fillStyle = '#6c757d'
        ctx.fillRect(150, 80, 100, 120)
        ctx.fillRect(170, 100, 60, 8)
        ctx.fillRect(170, 120, 60, 8)
        ctx.fillRect(170, 140, 40, 8)
        
        // Add text
        ctx.fillStyle = '#495057'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('File Preview', 200, 250)
        
        thumbnailBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 })
      }
    }

    if (!thumbnailBlob) {
      throw new Error('Failed to generate thumbnail')
    }

    // Upload thumbnail to Supabase Storage
    console.log('Uploading thumbnail to storage...')
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('thumbnails')
      .upload(thumbnailFileName, thumbnailBlob, {
        contentType: 'image/jpeg',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(`Failed to upload thumbnail: ${uploadError.message}`)
    }

    // Get public URL for the uploaded thumbnail
    const { data: urlData } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(thumbnailFileName)

    const thumbnailUrl = urlData.publicUrl

    // Update the content record with the generated thumbnail URL
    console.log('Updating content record...')
    const { error: updateError } = await supabase
      .from('content')
      .update({
        generated_thumbnail_url: thumbnailUrl,
        thumbnail_auto_generated: true
      })
      .eq('id', materialId)

    if (updateError) {
      console.error('Update error:', updateError)
      throw new Error(`Failed to update content record: ${updateError.message}`)
    }

    console.log('Thumbnail generated successfully:', thumbnailUrl)

    return new Response(
      JSON.stringify({ 
        success: true, 
        thumbnailUrl,
        message: 'Thumbnail generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating thumbnail:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate thumbnail', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})