export function urlBuilder(type, slug) {
    let url = ""
    let categoryPathSlug = "category"
    let tagPathlug = "tag"
    let postPathSlug = ""


    if(type === "category") {
        url = `/${categoryPathSlug}/${slug}`
    }

    
    if(type === "tag") {
        url = `/${tagPathlug}/${slug}`
    }

    if(type === "post") {
        if(!postPathSlug) {
            url = `/${slug}`
        } else {
            url = `/${postPathSlug}/${slug}`
        }
        
    }

    return url
}