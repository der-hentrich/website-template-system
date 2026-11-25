#!/usr/bin/env bash

set -euo pipefail

OUT_DIR="ek-hotel-bogota-images"
ZIP_FILE="ek-hotel-bogota-images.zip"

command -v curl >/dev/null 2>&1 || { echo "Fehler: curl ist nicht installiert."; exit 1; }
command -v file >/dev/null 2>&1 || { echo "Fehler: file ist nicht installiert."; exit 1; }
command -v zip >/dev/null 2>&1 || { echo "Fehler: zip ist nicht installiert. Unter Ubuntu/WSL: sudo apt install zip"; exit 1; }

rm -rf "$OUT_DIR" "$ZIP_FILE"
mkdir -p "$OUT_DIR"

declare -A HASHES

download_image() {
    local name="$1"
    local url="$2"
    local tmp="$OUT_DIR/.${name}.tmp"

    echo "Lade: $name"

    curl -L --fail --silent --show-error --retry 3 --retry-all-errors \
        -A "Mozilla/5.0" \
        "$url" \
        -o "$tmp"

    local mime
    mime="$(file --mime-type -b "$tmp")"

    local ext
    case "$mime" in
        image/jpeg) ext="jpg" ;;
        image/png) ext="png" ;;
        image/webp) ext="webp" ;;
        image/gif) ext="gif" ;;
        *)
            rm -f "$tmp"
            echo "Fehler: $name lieferte keinen unterstützten Bildtyp ($mime)." >&2
            return 1
            ;;
    esac

    local hash
    hash="$(sha256sum "$tmp" | awk '{print $1}')"

    if [[ -n "${HASHES[$hash]:-}" ]]; then
        echo "Duplikat übersprungen: $name = ${HASHES[$hash]}"
        rm -f "$tmp"
        return
    fi

    local target="$OUT_DIR/${name}.${ext}"
    mv "$tmp" "$target"
    HASHES[$hash]="$target"

    echo "Gespeichert: $target"
}

# google_maps.raw_data.images

download_image "google-alle" \
"https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm0JUA7Wj5frSIdcLD4JsrCl99zaHMYa8uHblFbXc69_t88-hELcZZ6eP0U1PiKvt_4ETxPGXdUXDC_VFHgyxBSy47YxIB4ijGCBJgUlsiwUyqY2UrynWl7IlUoKOzu__7ccjo-=w397-h298-k-no"

download_image "google-neueste" \
"https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlTLbcw9fPNr-BjHX6VY3Mb459FMeC5r8-c4D6l5nyb_DKb7O0fSWuvXJgDHYQBUED9UQoIhfWEY8DvVq_kJ1gcvRQsjR8NAYu_nPLKmd5gYjr8XRvM2lKASTtYHCDQEGeW-JGwmsRlFV4=w224-h398-k-no"

download_image "google-videos" \
"https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkEfR56d9MeAX4RkwSjNyyiIx_siw-H2xhzA5YeCSoD1txbUOY0BUdQncLZSzAhkLl79_A0SfM9_lSWjeTGP87rySAqmnh6rGcI4E88Bl6Q300uetvmelUxzUrgs2zqCCri2mVcGtOYtgUF=w224-h398-k-no"

download_image "google-zimmer" \
"https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnyqgRU_WxPIwUBh9bUfPLrh2yTy23zVfP4cuGI0-cxaB7ACtuCoYHSMnoN6OKBa9_nHoacmZhqbB4_vODoD0ZkI-NQgYJTlDOCpZU954xW3MwFlvMhZffCSs5ZVq0z6d1XD8zr=w397-h298-k-no"

download_image "google-aussenbereich" \
"https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnPpNrnxe6qSZyYToOD2mXjp4m9HJsUpDHoosym0_Hxbv4rzTi03x6jkTCdCgBFJmWnGSTdy6MoSwa_lkPIhrY-aYgRRL7t8XEkJAS1D65mGNJLY4tlAhPY8luZ60JNJ3edJmpCcEjv8JsX=w224-h398-k-no"

download_image "google-essen-und-trinken" \
"https://lh3.googleusercontent.com/gps-cs-s/AHRPTWk2kPw73HEly9bZOF3ER-LvMmM4-GcnkzhAi27_4XJQZ1TY6_qara7BGKOOcoCHcegXSitjOAOxrC09ykb-pf4heLOhVuGPWUGq2RBN2YiQvMgGiEW4G49rtyFF1XE0kQJHJrl9uA=w397-h298-k-no"

download_image "google-von-gaesten" \
"https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkt7mEX5EMCaFnxFK6r_HuBn2L3XmgnF6wB8cUHaGJjG9HgKIwtnB9QOzETdIbq3d5sEFljUnwR5KMC8ss7ILcz01iX0BbwvMmtBKsyshj22JSr1Vs7SSD_SDb1NiXGBGR4J9Jg=w224-h398-k-no"

download_image "google-street-view-360" \
"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=0ssLoIdGn6PSbTKoMifSDg&cb_client=maps_sv.tactile.gps&w=224&h=298&yaw=199.7539&pitch=0&thumbfov=100"

# user_reviews[].Images
# Diese Bilder besitzen im Datensatz keinen Motiv-Tag.
# Deshalb wird ausschließlich der vorhandene Reviewer-Name verwendet.

download_image "review-luca-goers-01" \
"https://lh3.googleusercontent.com/grass-cs/ACvplmO3AzYuiTyvlttzBms-8BKm5BfAXCFZSKLi3-wY30DjSqOpic68yxtGru99bYBfTTNpqTwVQHLPTz1qofwIUN6hiJSEJCd3vDJ_XNrn6S2rAebfvw-duLU8e2DhCGW96rvpJsuiXOXBzmI=k-no"

download_image "review-patricia-aiko-obara-01" \
"https://lh3.googleusercontent.com/grass-cs/ACvplmPaDhYAfonc3zMHEHPBvihN4QMrWIG8AfvRrnJmqrgiolaXg3RyL1YPuVKRfi7bm8HFPZ803SOMw8k4izJk4gabxmgczHSB3kAdDGGZubZPhv2ofZZvHn7U4gKdWh9-jtKo9DJ0zkjn0yyX=k-no"

download_image "review-patricia-aiko-obara-02" \
"https://lh3.googleusercontent.com/grass-cs/ACvplmNxqFxMQ-UCLmxJi2l7OrmI947K06mnMSLuhoGpbpKiaYJmP485r5ugjp_U3Fde5hPhMtYv9OamDhvr8NtSY5lNCBQeKEmXGGtht3Q8pc0YpRm4XbYkx17HmUq-cnaIijWKDkZGmAra4wsp=k-no"

download_image "review-patricia-aiko-obara-03" \
"https://lh3.googleusercontent.com/grass-cs/ACvplmPM8wejric5e2lOj4eiyRauXzZRs58CR9dEYIdOri7C8adg-gqQbbkilC0uUf_RY3jezy9D-4W7Y9dwErK8EUPpSjGfkpvU0DqZKAyBwpT8TnCD0Vm-5nNYTUGtwFFPS3PCZb4dc8obTPAW=k-no"

download_image "review-patricia-aiko-obara-04" \
"https://lh3.googleusercontent.com/grass-cs/ACvplmMUlLuqcyTqW3ymhra7fl5Kmurq3gSW1truiylb6INbMV5WXy1XCDKtrD6usQ7ZZ54RDCtvsWd_Iu3M4Sgq-2Tra5wR9y29wRLyocy62YVrGMEQ2YjfcAGw-tXFo6hIQ4d92DsA15he30L1=k-no"

download_image "review-patricia-aiko-obara-05" \
"https://lh3.googleusercontent.com/grass-cs/ACvplmMF12w7JuvkhEooUoTyWwfaJ53PjkhsoUZmufmRcDp29OX3htMsaYnak-EuzNGVXzmPbniV_belXgGbQ8Dt18w3_nhcJ80deK99aKm0KIrdSQF2NHyvTwwa98LdXMO_zef_q-zK0X2LyJFA=k-no"

zip -rq "$ZIP_FILE" "$OUT_DIR"

echo
echo "Fertig."
echo "Ordner: $OUT_DIR"
echo "ZIP:     $ZIP_FILE"
echo "Bilder:  $(find "$OUT_DIR" -type f | wc -l)"